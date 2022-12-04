const user = document.getElementById('usuario')
const password = document.getElementById('password')
const boton = document.getElementById('boton');
let correctUser = false;

boton.addEventListener('click', async()=>{
    user.value = user.value.trim();
    if(!user.value || !password.value){
        alert('Completa los recuadros')
    }
    else{
        await fetch('https://shtaiger-jump.herokuapp.com/api/findUser',{method:'POST',body:JSON.stringify({
            email:user.value,
        }),headers:{
            "Content-Type":"application/json"
        }}).then(res=>res.json()).then(res=>{
            if(res.message!==null){
                correctUser = true;
            }else{
                alert('Usuario no encontrado')
            }
            
        }).catch(err=>alert('Usuario no encontrado'))
        let data = {
            "email":user.value,
            "password":password.value
        }
        if(correctUser){
            await fetch('https://shtaiger-jump.herokuapp.com/api/login',{method:'POST',body:JSON.stringify(data),headers:{
                "Content-Type":"application/json",
            }}).then(res=>res.json()).then(res=>{
                if(res.token){ 
                localStorage.setItem('user',user.value)
                localStorage.setItem('token',res.token)
                window.location.href = 'index.html';}
                else{
                    alert('Contra incorrecta')
                }
                }
                ).catch(()=>{
                    alert('Contra incorrecta')
                })
        }
        
    }
})
