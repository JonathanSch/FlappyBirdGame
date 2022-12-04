const user = document.getElementById('usuario')
const password = document.getElementById('password')
const boton = document.getElementById('boton');

boton.addEventListener('click', async()=>{
    user.value = user.value.trim();
    if(!user.value || !password.value){
        alert('Completa los recuadros')
    }
    else{
        let data = {
            "email":user.value,
            "password":password.value
        }
        await fetch('https://shtaiger-jump.herokuapp.com/api/createUser',{method:'POST',body:JSON.stringify(data),headers:{
            "Content-Type":"application/json",
        }}).then(res=>{
            return res.json();
           }).then(async(res)=>{
               if(res.code!==11000){
                await fetch('https://shtaiger-jump.herokuapp.com/api/login',{method:'POST',headers:{
                    "Content-Type":"application/json",
                },body:JSON.stringify(data)}).then(res=>res.json()).then(res =>{
                    localStorage.setItem('token',res.token)
                    localStorage.setItem('user',user.value)
                    window.location.href = 'index.html'
                }).catch(err=>console.log(err))
               }else{
                   alert('El usuario ya existe')
               }
               }).catch(err=>console.log(err))
    }
})
