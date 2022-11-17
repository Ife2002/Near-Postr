import React, {Component } from 'react'
import { onSubmit }from '../utils'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './Navbar' 
import 'bootstrap/dist/css/bootstrap.css'
import { sha256} from 'js-sha256';
import Identicon from 'identicon.js';
toast.configure()
const notify = () => {
    toast.success(<Notification />)
}
class Main extends Component{
    async updatePosts (){
        await window.contract.getPostList({ accountId: window.accountId })
        .then(allPostArray => {
          const data =  allPostArray
            this.props.allPost = data
            
            
        })
        }
        editPost (){
         window.contract.editPost({ postId: window.contract.getPostById })
      }
        constructor(props){
            super(props)
            this.state ={
              notification : false
            }
          }
    render() {
        return (
            <div>
            <Navbar />
            <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto mr-auto" style={{ maxWidth: '500px'}}>
                  <div className="content mr-auto mr-sm-2">
                      <p>&nbsp;</p>
                      <form onSubmit={async event => {
                    await onSubmit(event)
                    notify()
        }}>
                          <div className="form-group mr-sm-2">
                          <input
                              id= "postTitle"
                              type="text"
                              className="form-control"
                              placeholder="Title"
                              required />
                              <input
                              id= "postContent"
                              type="text"
                              className="form-control"
                              placeholder="What's on your mind?"
                              required />
                          </div>
                          <button type="submit" className="btn btn-primary btn-block">Share</button>
                      </form>
                      <p>&nbsp;</p>
                {this.props.allPost.map((post,key) =>{
                    return(
                        <div className="card mb-4" key={key} >
                        <div className="card-header">
                        <img className="ml-2"
                            width='30' 
                            height='30'
                            alt='userIdenticon'
                            src= {`data:image/png;base64,${new Identicon(sha256(post.owner), 30).toString()}`}
                            />
                          <small className="text-muted" >{post.owner}</small>
                        </div>
                        <ul id="postList" className="list-group list-group-flush" >
                          <li className="list-group-item" >
                          <h5 className="card-title">{post.title}</h5>
                            <p className="text-justify card-text"> {post.body}</p>
                          </li>
                          <button onClick={editPost}>Edit</button>
                         
                        </ul>
                      </div>
                    )
                })}
                
                </div>
              </div>
              
            </main>
            
          </div>
        </div>
        </div>
        );   
    }
    
    
}

export default Main;
function Notification() {
    
    return (
      <div>
        <p>Post Submited Successfuly</p>
    </div>
    )
  }