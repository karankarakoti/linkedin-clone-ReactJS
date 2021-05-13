import { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import firebase from 'firebase'
import { postArticleAPI } from '../actions'

const PostModal = (props) => {

    const [editorText, setEditorText] = useState('')
    const [shareImage, setShareImage] = useState('')
    const [videoLink, setVideoLink] = useState('')
    const [assetArea, setAssetArea] = useState('')

    const handleChange = (e) => {
        const image = e.target.files[0]

        if(image === '' || image === undefined) {
            alert(`Not an image, the file is a ${typeof(image)}`)
            return
        }
        setShareImage(image)
    }

    const switchAssetArea = (area) =>{
        setShareImage('')
        setVideoLink('')
        setAssetArea(area)
    }

    const postArticle = (e) => {
        e.preventDefault()
        if(e.target !== e.currentTarget){
            return
        }

        const payload = {
            image: shareImage,
            video: videoLink,
            user: props.user,
            description: editorText,
            timestamp: firebase.firestore.Timestamp.now()
        }

        props.postArticle(payload)
        reset(e)
    }

    const reset = (e) => {
        setEditorText('')
        setShareImage('')
        setVideoLink('')
        props.handleClick(e)
    }

    return(
        <>
        { props.showModal === 'open' &&
        <Container>
            <Content>
                <Header>
                    <h2>Create a post</h2>
                    <button onClick={event=>reset(event)}>
                        <img src='/images/close-icon.svg' />
                    </button>
                </Header>
                <SharedContent>
                    <UserInfo>
                        <img src={props.user ? props.user.photoURL : "/images/user.svg" } alt="" />
                        <span>{props.user && props.user.displayName}</span>
                    </UserInfo>
                    <Editor>
                        <textarea
                            value={editorText}
                            onChange={e=>setEditorText(e.target.value)}
                            placeholder="What do you want to talk about"
                            autoFocus={true}
                        /> 
                         
                        {
                            assetArea === 'image' ?
                            <UploadImage>
                            <input
                                type='file'
                                accept='image/gif, image/jpeg, image/png'
                                name='image'
                                id='file'
                                style={{display:'none'}}
                                onChange={handleChange}
                            />
                            <p>
                                <label
                                    htmlFor='file'
                                    style={{cursor: 'pointer'}}
                                >
                                    Select an image to share
                                </label>
                            </p>
                            {
                                shareImage && 
                                    <img src={URL.createObjectURL(shareImage)} />
                            }
                            </UploadImage>
                            : assetArea === 'media' &&
                            <UploadImage>
                                <input
                                    type='text'
                                    placeholder='Please input a video link'
                                    value={videoLink}
                                    onChange={e=>setVideoLink(e.target.value)}
                                />
                                {
                                    videoLink &&
                                        <ReactPlayer
                                            width={'100%'}
                                            url={videoLink}
                                        />
                                }
                            </UploadImage>
                        }   
                                                                                       
                    </Editor>
                </SharedContent>
                <SharedCreation>
                    <AttachAssets>
                        <AssetButton onClick={()=>switchAssetArea('image')}>
                            <img src="/images/photo-icon.svg" alt="" />
                        </AssetButton>                        
                        <AssetButton onClick={()=>switchAssetArea('media')}>
                            <img src="/images/video-icon.svg" alt="" />
                        </AssetButton>
                    </AttachAssets>
                    <ShareComment>
                        <AssetButton>
                            <img src="/images/comments-icon.svg" alt="" />
                            Anyone
                        </AssetButton>
                    </ShareComment>
                    <PostButton 
                        disabled={!editorText ? true : false} 
                        onClick={event=>postArticle(event)}                       
                    >
                        Post
                    </PostButton>
                </SharedCreation>
            </Content>
        </Container>        
        }
        </>
    )
}

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    color: black; 
    background-color: rgba(0, 0, 0, 0.6);
    animation: fadeIn 0.3s;
`
const Content = styled.div`
    width: 100%;
    max-width: 552px;
    background-color: white;
    max-height: 90%;
    overflow: initial;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 32px;
    margin: 0 auto;
    @media(max-width: 768px){
        max-width: 400px;
    }
`
const Header = styled.div`
    display: block;
    padding: 16px 20px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.15);
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button{
        height: 40px;
        width: 40px;
        min-width: auto;        
        border: 1px solid rgba(0, 0, 0, 0.15);
        outline: none;
        background-color: white;
        border-radius: 5px;
        svg, img{
            pointer-events: none;
        }
    }
`
const SharedContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    vertical-align: baseline;
    background: transparent;
    padding: 8px 12px;
`
const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    svg, img{
        height: 40px;
        width: 40px;
        background-clip: content-box;
        border: 2px solid transparent;
        border-radius: 50%;
    }
    span{
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-left: 5px;
    }
`
const SharedCreation = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 24px 12px 16px;
`
const AssetButton = styled.button`
    display: flex;
    align-items: center;
    margin-left: 5px;
    height: 40px;
    min-width: auto;    
    border: 1px solid rgba(0, 0, 0, 0.06);
    outline: none;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.02);
`
const AttachAssets = styled.div`
    align-items: center;
    display: flex;
    padding-right: 8px;
    ${AssetButton}{
        width: 40px;
    }
`
const ShareComment = styled.div`
    padding-left: 8px;
    margin-right: auto;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    ${AssetButton}{
        svg{
            margin-right: 5px;
        }
    }
`
const PostButton = styled.button`
    min-width: 60px;
    border-radius: 20px;
    padding-left: 16px;
    padding-right: 16px;
    background: ${props => props.disabled ? 'rgba(0, 0, 0, 0.38)' : "#0A66C2"};    
    color: #FFF;
    border: none;
    outline: none;
    &:hover{
        background: ${props => props.disabled ? 'rgba(0, 0, 0, 0.38)' : "#004182"};            
    }
`
const Editor = styled.div`
    padding: 12px 24px;
    textarea{
        width: 100%;
        min-height: 100px;
        resize: none;
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.16);
        border-radius: 5px;
    }
    input{
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-bottom: 20px;
    }
`
const UploadImage = styled.div`
    text-align: center;
    img{
        width: 100%;
    }
    p{
        margin-top: 10px;
        label{            
            font-weight: 400;
            font-size: 14px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            padding: 5px;
            border-radius: 5px;
            color: white;
            background-color: #0A66C2;
        }
    }
    input{
        margin-top: 10px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        outline: none;
        border-radius: 5px;
        font-size: 14px;
    }
`

const mapStateToProps = (state) =>{
    return{
        user: state.userState.user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    postArticle: (payload) => dispatch(postArticleAPI(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostModal)