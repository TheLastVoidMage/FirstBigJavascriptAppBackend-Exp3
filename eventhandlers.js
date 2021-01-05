$(function () {
  var socket = io();

  $('#chart').hide()
  
  $('form').submit((e) => {
    e.preventDefault(); // prevents page reloading
    
    // Get form values
    let userFullName = $('#form-user-full-name').val();
    let userShortName = $('#form-user-short-name').val();
    let userMessage = $('#form-user-message').val();
    let userFavoriteNumber = $('#form-user-favorite-number').val();
    let userFavoriteColor = $('#form-user-favorite-color').val();

    // Form the JSON data
    let jsonData = {
      "socketId": socket.id,
      "userFullName": userFullName,
      "userShortName": userShortName,
      "userMessage": userMessage,
      "userFavoriteNumber": userFavoriteNumber,
      "userFavoriteColor": userFavoriteColor
    }
    
    // Emit jsonData to all
    socket.emit('user-update', jsonData);

    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('user-update', function(jsonData) {
    
    // Update user card
    //$('#card-user-full-name-1').text(jsonData.userFullName);
    //$('#card-user-short-name-1').text(jsonData.userShortName);
    //$('#card-user-message-1').text(jsonData.userMessage);
    //$('#card-user-favorite-number-1').text(jsonData.userFavoriteNumber);
    //$('#card-user-favorite-color-1').css('background-color', jsonData.userFavoriteColor);
  
    // Update user card
    let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
    
    if (!userCard.length) {
      console.log('Making a box');
      userCard = $('.box').first().clone();
      userCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
    }

    userCard.find('strong').text(jsonData.userFullName);
    userCard.find('small').text(jsonData.userShortName);
    userCard.find('em').text(jsonData.userFavoriteNumber);
    userCard.find('span').text(jsonData.userMessage);
    userCard.find('figure').css('background-color', jsonData.userFavoriteColor);

    chart.data.datasets.push({
      data: [jsonData.userFavoriteNumber],
      backgroundColor: [jsonData.userFavoriteColor]
    });
    chart.update();

  });

  socket.on('user-typing', function(jsonData){      
    $('#user-typing-status').text(jsonData.socketId);

    // Update user card
    let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);

    if (userCard) {
      userCard.find('div.icon').removeClass('is-hidden');
      setTimeout(function() {
        userCard.find('div.icon').addClass('is-hidden');
      }, 3000);
    }
    
  });

  socket.on('connect-count', function(count){
    
    // Update Count of Connection on the Site
    console.log(count);
    $('#people-connected').text(count);

  });

  socket.on('connect-user', function(jsonData){
    
    // Update number of user-list boxes      
    if (jsonData.socketId !== socket.id) 
    {
      let newCard = $('.box').first().clone();
      newCard.attr('data-socket-id', jsonData.socketId).appendTo('#user-list');
    } 
    
  });

  socket.on('disconnect-user', function(jsonData){
    
    // Delete user card
    let userCard = $(`.box[data-socket-id="${jsonData.socketId}"]`);
    userCard.find('small').text("Disconnected");
    
  });

  

  socket.on("connect", () => {
    //$('.box').first().data('socket-id', socket.id);
    $('.box').first().attr('data-socket-id', socket.id);
  });

    const fullNameFromLocalStorage = window['localStorage'].getItem('fullName');

  // Key Up Listener for Full Name Field in Form
  $("#form-user-full-name").keyup(() => {
    socket.emit('user-typing', { "socketId": socket.id });
  });

});