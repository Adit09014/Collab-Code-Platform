import React from 'react'
import Editor from "@monaco-editor/react"
import { io } from "socket.io-client"
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../lib/axios';
import { useProjectStore } from '../store/useProjectStore';

const socket = io("http://localhost:5001");

const CodeEditor = () =>{
    const [code,setCode] = useState("Code Here");
    const {changeCode,selectedFile,getCode} = useProjectStore();

    useEffect(()=>{
        const fetchCode = async()=>{
            if(selectedFile){
                const fileCode = await getCode(selectedFile);
                if(fileCode!==undefined && fileCode!==""){
                    setCode(fileCode);
                }
                else{
                    setCode("Code Here");
                }
            }
        };

        fetchCode();
    },[selectedFile,getCode]);

    useEffect(()=>{
        const handleCodeUpdate = ({ fileId, newCode }) => {
            if (fileId === selectedFile) {
                setCode(newCode);
            }
        };

        socket.on("codeUpdate", handleCodeUpdate);

        return () => {
            socket.off("codeUpdate", handleCodeUpdate);
        };
    },[selectedFile]);

    const handleChange = value =>{
        setCode(value);
        if(selectedFile){
            socket.emit("codeChanges",{fileId:selectedFile,newCode:value});
        }
    }

    const handleCommit = async()=>{
        if(!selectedFile){
            return;
        }
        await changeCode(selectedFile,code);
    }

    return(
        <div className="flex flex-col flex-1 h-screen">
        <div className="p-2 border-b bg-gray-800">
            <button
            onClick={handleCommit}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
            >
            Commit
            </button>
        </div>
        <Editor
            height="100%"
            width="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={handleChange}
            theme="vs-dark"
        />
        </div>
    )
}

export default CodeEditor;