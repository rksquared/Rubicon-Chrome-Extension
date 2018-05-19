window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    console.log('clicked')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      var x = new XMLHttpRequest();
      x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
      x.onload = function() {
          alert(x.response);
      };
      x.send();
    });

  });
};