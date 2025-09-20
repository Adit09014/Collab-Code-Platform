import React from 'react'
import Editor from "@monaco-editor/react"
import { io } from "socket.io-client"
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../lib/axios';
import { useProjectStore } from '../store/useProjectStore';

const socket = io("http://localhost:5001");

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions" 
const RAPID_API_KEY = "48e989d453msh906033d47853255p1711dajsn3f5dadb28e3d"

const CodeEditor = () =>{
    const [code,setCode] = useState("Code Here");
    const {changeCode,selectedFile,getCode,selectedLang} = useProjectStore();
    const [output,setOutput] = useState("")

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
        console.log(selectedLang)

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

    const handleRun = async()=>{
        try{
            setOutput("Running");
            const languageMap = {
                javascript: 63,
                cpp: 54,
                c: 50,
                java: 62,
                python: 71
            }

            const langId=languageMap[selectedLang] || 63;

            const res = await axios.post(
                `${JUDGE0_API}?base64_encoded=false&wait=true`,
                {
                source_code: code,
                language_id: langId
                },
                {
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    "X-RapidAPI-Key": RAPID_API_KEY
                }
                }
            )

            if(res.data.stderr){
                setOutput(res.data.stderr)
            }
            else if(res.data.compile_output){
                setOutput(res.data.compile_output)
            }
            else{
                setOutput(res.data.stdout ||"No Output");
            }
        }
        catch(err){
            console.log(err.message);
            setOutput("Error running the code");
        }
    }

    return(
        <div className="flex flex-col flex-1 h-screen">
        <div className="p-2 border-b bg-gray-800 flex gap-2">
            <button
            onClick={handleCommit}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
            >
            Commit
            </button>
            <button onClick={handleRun}
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500">
                Run
            </button>
        </div>
        
        <Editor
            height="100%"
            width="100%"
            language={selectedLang}
            value={code}
            onChange={handleChange}
            theme="vs-dark"
        />
        <div className="bg-black text-green-400 p-3 h-1/4 overflow-y-auto">
            <pre>{output}</pre>
        </div>

        </div>
    )
}

export default CodeEditor;