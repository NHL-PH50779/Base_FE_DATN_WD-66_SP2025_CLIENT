// Script để set token test vào localStorage
const testToken = '138|1FYs84CgnHGdlEuIwpbhrClMlYQjvxZ8EHo9JFG69586c193';
const testUser = {
  id: 16,
  name: 'tuan',
  email: 'test234@gmail.com',
  role: 'client'
};

localStorage.setItem('token', testToken);
localStorage.setItem('user', JSON.stringify(testUser));

console.log('✅ Test token và user đã được set vào localStorage');
console.log('Token:', testToken);
console.log('User:', testUser);