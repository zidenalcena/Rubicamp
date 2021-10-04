import React, { Component } from 'react'
import io from 'socket.io-client'
import axios from 'axios';
import Form from './Form'


const socket = io('http://localhost:3001');
export default class ItemChat extends Component {
    state = {
        fullname: '',
        message: '',
        content: []
    }



    componentDidMount() {
        socket.on('receive-message', (data) => {
            console.log('ketika ngeadd',data)
            this.setState({
                content: [...this.state.content, data]

            });
        });

        socket.on('deleted-message', (data) => {            
            this.setState({
                content: this.state.content.filter(item => item._id !== data._id)

            });
        });

        axios.get(`http://localhost:4000/api/users`)
            .then(data => {
                this.setState({
                    content: [...data.data]
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleClick = userId => {

        const requestOptions = {
            method: 'delete'
        };

        fetch("http://localhost:4000/api/users/" + userId, requestOptions).then((response) => {
            return response.json();
        }).then((userRemove) => {
            console.log(userRemove);
            
            const socket = io('http://localhost:3001/');
            console.log("socket");
            
            socket.emit('delete-message',userRemove.userRemove);
        });
    }
    
    render() {
        return (

            <ul className="timeline">
                {this.state.content.map((item, index) => {
                    return (
                        <li className="timeline-inverted" key={index}>
                            <button className="timeline-badge danger" type="submit" onClick={() => { this.handleClick(item._id) }}><i className="fa fa-trash"></i></button>
                            <div className="timeline-panel">
                                <div className="timeline-body">
                                    <h6 className="timeline-title">{item.fullname}</h6>
                                    <p>{item.message}</p>
                                </div>
                            </div>
                        </li>
                    )
                })}
                <Form  />
            </ul>
        )
    }
}


