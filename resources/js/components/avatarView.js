import React, { Component } from 'react';
import SideBar from './SideBar.js'
import Avatar from './Avatar.js'
import axios from 'axios';
import './ComponentCSS/viewAvatar.css'


export default class AvatarView extends Component{
    state = {
        name : 'Default',
        face : 'Cara1',
        hair : 'Pelo1',
        eyes : 'Ojos1',
        mouth : 'Boca1',
        AllAvatars : [],
        userID : -1,
        avatarID : -1,
    };
    
   handleNameChange(event){
   
     this.setState({name : event.target.value});
   }

   handleFaceChange(event){
        this.setState({
            face : event.target.name
        })

    }
    handleHairChange(event){
        this.setState({
            hair : event.target.name
        })

    }
    handleEyesChange(event){
        this.setState({
            eyes : event.target.name
        })

    }
    handleMouthChange(event){
        this.setState({
            mouth : event.target.name
        })

    }

    loadAvatar(event){
        let ID = event.target.value;
        console.log(this.state.AllAvatars[ID])
        this.setState({
            name : this.state.AllAvatars[ID].name,
            face : this.state.AllAvatars[ID].skin,
            hair : this.state.AllAvatars[ID].hair,
            eyes : this.state.AllAvatars[ID].eyes,
            mouth : this.state.AllAvatars[ID].mouth,
            avatarID : this.state.AllAvatars[ID].id
        })
    }


    componentDidMount () {
        let token = document.head.querySelector('meta[name="api-token"]');
        token = token.content; //obtengo el api-token del usuario
   
        //preparo el mensaje para mandar el token
        /*var config = {
            headers: {'Authorization': "Bearer " + token}
        };
        
        var bodyParameters = {
           key: "value"
        }*/
        //intento hacer la llamada por axios
        axios.get( 
          'api/user/'
        ).then((response) => {
          
            this.setState({
                userID : response.data
            })
            
            axios.get(
                'api/' + this.state.userID + '/avatars'
                
            ).then((response) =>{
                if(response.data.length != 0){
                    this.setState({
                        AllAvatars : response.data
                        
                    })
                }
                
            })
        }).catch((error) => {
          console.log(error)
        });
    }

    defaultAvatar(event){
        this.setState({
            name : '',
            face : 'Cara1',
            hair : 'Pelo1',
            eyes : 'Ojos1',
            mouth : 'Boca1',
            avatarID : -1
        })
        alert("Avatar reseteado para crear uno nuevo")
    }

    constructor(props) {
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFaceChange = this.handleFaceChange.bind(this);
        this.handleHairChange = this.handleHairChange.bind(this);
        this.handleEyesChange = this.handleEyesChange.bind(this);
        this.handleMouthChange = this.handleMouthChange.bind(this);
        this.handleCreateNewAvatar = this.handleCreateNewAvatar.bind(this);
        this.loadAvatar = this.loadAvatar.bind(this);
        this.defaultAvatar = this.defaultAvatar.bind(this);
        this.newAvatares = this.newAvatares.bind(this);
    }
    
    newAvatares(ID){
        let avatares = []
        for(let i = 0; i < this.state.AllAvatars.length; i++){
            console.log(this.state.AllAvatars[i])
            console.log(this.state.AllAvatars[i].avatarID + " , " + ID)
            if(this.state.AllAvatars[i].id != undefined){
                if(this.state.AllAvatars[i].id != ID)
                avatares[i] = this.state.AllAvatars[i]    
            }
        }
        
        console.log(avatares);
        return avatares
    }

    handleCreateNewAvatar(event){
        event.preventDefault(); //evito que la página reaccione e intente hacer un POST convencional para yo manejarlo por la API
    
         if(this.state.name == "")
            alert("No se puede tener un avatar SIN nombre, por favor, ingrese un nombre")
        else{
            const avatar = {
                name : this.state.name,
                skin : this.state.face,
                hair : this.state.hair,
                eyes : this.state.eyes,
                mouth : this.state.mouth,
                userID : this.state.userID,
                avatarID : this.state.avatarID 
            }
         
            if(this.state.avatarID == -1){
                //hago el POST por Axios a la API que yo creé, el avatar es uno nuevo que debo crear y guardar en la BD
                axios.post('api/' + this.state.userID + '/avatars', avatar).then(res => {
                        this.setState({
                            avatarID : res.data,
                            AllAvatars : this.state.AllAvatars.concat(avatar) 
                        })  
                        alert("Tu avatar ha sido guardado con exito");
                })
            }
            else{//asumo que avatarID != -1
                //el avatar es uno que debo modificar en la BD, hago un PUT por axios a un metodo Update en el controlador
                axios.put('api/' + this.state.userID + '/avatars/' + this.state.avatarID, avatar).then(res =>{
                    axios.get(
                        'api/' + this.state.userID + '/avatars'
                        
                    ).then((response) =>{
                        if(response.data.length != 0){
                            this.setState({
                                AllAvatars : response.data
                                
                            })
                        }
                        
                    })
                })
                alert("tu avatar se ha modificado con exito")
            } 
            //el then(...) es lo que hace la página una vez que el pedido AJAX vuelve con al respuesta (recordar que esto se hace en background)
           
        }
     

    }

    render(){
        return (
            <>
              <div className="col-md-3 alturaSidebar">
                        <SideBar
                            handleFaceChange={this.handleFaceChange}
                            handleHairChange={this.handleHairChange}
                            handleEyesChange={this.handleEyesChange}
                            handleMouthChange={this.handleMouthChange}
                            AllAvatars={this.state.AllAvatars}
                            handleCreateNewAvatar = {this.handleCreateNewAvatar}
                            loadAvatar = {this.loadAvatar}
                            defaultAvatar = {this.defaultAvatar}
                        />
                </div>

                <div className="side">
                    <div className="col-md-12 text-center side">
                        <Avatar 
                            handleNameChange={this.handleNameChange}
                            face={this.state.face}
                            hair={this.state.hair}
                            eyes={this.state.eyes}
                            mouth={this.state.mouth}
                        />
                    </div>
                </div>

            </>
        )
    }
}