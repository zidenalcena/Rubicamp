// import React from 'react'

// export default function Tittle() {
//     return (
//         <div className="top_menu">
//             <div className="buttons">
//                 <div className="button close"></div>
//                 <div className="button minimize"></div>
//                 <div className="button maximize"></div>
//             </div>
//             <div className="title">Chat</div>
//         </div>
//     )
// }

import React from 'react';
 
function Title() {
    return (
        < div className="container mt-5" >
            <div className="card">
                <div className="card-body" style={{background: '#eeeeee'}}>
                    <div className="container">
                        <h3 align="center">React Chat</h3>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Title; 