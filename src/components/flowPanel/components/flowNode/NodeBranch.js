import React, {useEffect, useRef} from 'react'

function NodeBranch({nodeId, branchList, onWidth, onBranchMouseDown}) {
  const branchRef = useRef()

  useEffect(() => {
    if (branchRef && branchRef.current && branchRef.current.offsetWidth > 200) {
      onWidth(branchRef.current.offsetWidth + 22)
    }
  }, [branchList, onWidth])

  return (
    <div className="node-branch" ref={branchRef}>
      {branchList.map(branchName => (
        <div
          id={`${nodeId}-${branchName}`}
          className="branch-item"
          key={branchName}
          onMouseDown={e => onBranchMouseDown(e, branchName)}
        >
          {branchName}
        </div>
      ))}
    </div>
  )
}

export default NodeBranch
