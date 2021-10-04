import React, { Component } from 'react';
import Title from './Title';
import Item from './Item'


class Chat extends Component {
    render() {
        return (
            <div>
                <Title />
                <div className="container">
                    <div className="container-fluid mt-4 ml-4">
                        <Item />
                    </div>
                </div>

            </div>

        )
    }
}

export default Chat; 