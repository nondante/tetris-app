import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';

import './Profile.css'

class Profile extends Component {
  state = {  }
  render() { 
    const { profileImg, totalScore, username, email, highScore } = this.props
    return (
    <div className="Profile">
      <div className="container">
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title mb-4">
                            <div className="d-flex justify-content-start">
                                <div className="image-container">
                                    <img style={{width:"100px", height: "100px",  objectFit: "cover"}} src={`${process.env.REACT_APP_PUBLIC_URL}uploads/media/${profileImg}`} id="imgProfile" className="img-thumbnail" />
                                </div>
                                <div className="userData ml-3">
                                    <h2 className="d-block">{username}</h2>
                                    <h6 className="d-block">Total Score: {totalScore}</h6>
                                    <h6 className="d-block">High Score: {highScore}</h6>
                                </div>
                                <div className="ml-auto">
                                <ImageUploader
                                          withIcon={false}
                                          buttonText='Update image'
                                          onChange={(image)=>{this.props.onDrop(image)}}
                                          imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                          maxFileSize={5242880}
                                          fileContainerStyle={{}}
                                          buttonStyles={{}}
                                          labelStyles={{}}
                                          singleImage={true}
                                          errorStyle={{}}
                                />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="basicInfo-tab" data-toggle="tab" href="#basicInfo" role="tab" aria-controls="basicInfo" aria-selected="true">Basic Info</a>
                                    </li>
                                </ul>
                                <div className="tab-content ml-1" id="myTabContent">
                                    <div className="tab-pane fade show active" id="basicInfo" role="tabpanel" aria-labelledby="basicInfo-tab">
                                        

                                        <div className="row">
                                            <div className="col-sm-3 col-md-2 col-5">
                                                <label>Username</label>
                                            </div>
                                            <div className="col-md-8 col-6">
                                                {username}
                                            </div>
                                        </div>
                                        <hr />

                                        <div className="row">
                                            <div className="col-sm-3 col-md-2 col-5">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-8 col-6">
                                                {email}
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>  
    );
  }
}
 
export default Profile;