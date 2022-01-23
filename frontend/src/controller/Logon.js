import api from '../services/api';

export default async function handleLogon(e,email,password){
    e.preventDefault();
    alert(password);
    try{
        //const response = await api.post('/',{
          //  email
       // })

    }catch(error){
        alert('falha ao logar')
    }
}