import React from 'react'
import CodeProjectSidebar from './CodeProjectSidebar'
import CodeEditor from './CodeEditor'

const CodeProject = () => {
  return (
    <div className='flex flex-row w-full'>
        <CodeProjectSidebar/>
        <CodeEditor/>
    </div>
  )
}

export default CodeProject