import React, { useState } from 'react'

const ReplyForm = ({ onSubmit }) => {
  const [reply, setReply] = useState("");

  const handleReply = () => {
    onSubmit(reply);
    setReply("");
  };


  return (
    <div>
      <textarea 
        placeholder='Reply as Admin'
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button onClick={handleReply}>댓글</button>
    </div>
  );
};

export default ReplyForm

