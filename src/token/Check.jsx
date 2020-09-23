import React from 'react'

export default ({ active }) => <svg style={{ cursor: 'pointer' }} width="29px" height="29px" viewBox="0 0 30 30" >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
        <path d="M15.8117647,1.97647059 C8.17147059,1.97647059 1.97647059,8.17147059 1.97647059,15.8117647 C1.97647059,23.4520588 8.17147059,29.6470588 15.8117647,29.6470588 C23.4520588,29.6470588 29.6470588,23.4520588 29.6470588,15.8117647 C29.6470588,8.17147059 23.4520588,1.97647059 15.8117647,1.97647059 Z"
            fill={active ? '#44D7B6' : ''}
            stroke={active ? '' : 'rgba(255,255,255,0.4)'} strokeWidth="0.658823529"></path>
        <path d="M21.5867647,10.9014706 L20.1383824,10.9014706 C19.8233824,10.9014706 19.5238235,11.0527941 19.3385294,11.3122059 L14.4838235,18.0445588 L12.285,14.9933824 C12.0997059,14.7370588 11.8032353,14.5826471 11.4851471,14.5826471 L10.0367647,14.5826471 C9.83602941,14.5826471 9.71867647,14.8111765 9.83602941,14.9748529 L13.6839706,20.3113235 C14.0761765,20.8579412 14.8883824,20.8579412 15.2805882,20.3113235 L21.7844118,11.2936765 C21.9048529,11.13 21.7875,10.9014706 21.5867647,10.9014706 Z" fill="#FFFFFF"></path>
    </g>
</svg>