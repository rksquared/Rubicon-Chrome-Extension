import axios from 'axios';

interface User {
  id: string,
  name: string,
  link?: string
}

var user: User = {id: '', name: '', link: ''};

window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
    .then((response: any) => {
      const { id, name, link } = response.data;

      axios.post('http:localhost:3005/api/chromeSession', { id })
      .then((res: any) => {
        console.log('session:', res);
      })
      
    })
    .catch((err: any) => {
      console.log(err);
    })
    });  
  });
};

export default user;