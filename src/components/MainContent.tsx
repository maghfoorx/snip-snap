import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? "https://alli-ben-maghfoor-pastebin.onrender.com"
    : "http://localhost:4000";

interface PasteBinType {
  id: number;
  date: Date;
  title: null | string;
  body: string;
}

interface PasteComment {
  comment_id: number;
  paste_id: number;
  comment_body: string;
  date: Date;
}

export default function MainContent(): JSX.Element {
  const [pasteBinBody, setPasteBinBody] = useState<string>("");
  const [pasteBinTitle, setPasteBinTitle] = useState<string>("");
  const [allData, setAllData] = useState<PasteBinType[]>([]);
  const [allComments, setAllComments] = useState<PasteComment[]>([]);
  //creating a function for individual snaps
  interface SnapProps {
    snap: PasteBinType;
    allCommProps: PasteComment[];
  }

  //creating a single component for an individual snap
  const SnapItem: React.FC<SnapProps> = (props: SnapProps) => {
    const sliceLength = 450;
    const { snap, allCommProps } = props;

    const [commentBody, setCommentBody] = useState<string>("");
    const [leaveCommentVis, setLeaveCommentVis] = useState<boolean>(false);
    const [CommsVis, setCommsVis] = useState<boolean>(false);
    const [comments, setComments] = useState<PasteComment[]>(
      allCommProps.filter((el) => el.paste_id === snap.id)
    );
    const [fullBody, setFullBody] = useState("");

    // const previousCommentsLength = useRef(comments.length)
    // useEffect(() => {
    //   if (comments.length !== previousCommentsLength.current) {
    //     previousCommentsLength.current = comments.length;
    //     setCommsVis(true);
    //     setLeaveCommentVis(true)
    //   }
    // }, [comments.length]);

    const handleReadMore = (body: string) => {
      setFullBody(body.slice(sliceLength, body.length));
      if (fullBody.length > 0) {
        setFullBody("");
      }
    };

    //creating a function the deletes a comment
    const deleteComment = async (id: number) => {
      try {
        await axios.delete(`${url}/comments/${id}`);
      } catch (error) {
        console.error(error);
      }
    };
    const handleDeleteCommentButton = (id: number) => {
      deleteComment(id).then(() => getAllComments());
    };

    //creating a function to handle deleting a paste and its comments
    const deletePaste = async (id: number) => {
      try {
        await axios.delete(`${url}/pastes/${id}`);
      } catch (error) {
        console.error(error);
      }
    };
    const handleDeletePasteButton = (id: number) => {
      deletePaste(id).then(() => getPastes());
    };
    const postComment = async (id: number, newComment: string) => {
      try {
        await axios.post(`${url}/comments`, {
          pasteID: id,
          commentBody: newComment,
        });
      } catch (error) {
        console.error(error);
      }
    };
    const handleSubmitComment = (id: number, comment: string) => {
      if (comment.length < 1) {
        alert("you can't post an empty comment either bro omd...");
      } else {
        postComment(id, comment);
        setCommentBody("");
        getAllComments();
      }
      // setLeaveCommentVis(false);
      // setCommsVis(false);
      // handleOpenComments();
      // console.log(CommsVis);
    };

    const handleOpenComments = () => {
      setCommsVis(!CommsVis);
      setLeaveCommentVis(!leaveCommentVis);
      console.log(CommsVis, leaveCommentVis);
    };

    return (
      <div key={snap.id}>
        <p>
          {snap.title ? (
            <>
              {snap.title} | {snap.date}
            </>
          ) : (
            <>{snap.date}</>
          )}
          <span>
            <button
              className="del-com-btn"
              onClick={() => handleDeletePasteButton(snap.id)}
            >
              ❌
            </button>
          </span>
        </p>

        <p>
          {snap.body.slice(0, sliceLength)}
          <span>{fullBody}</span>
        </p>
        <span>
          {snap.body.length > sliceLength && fullBody.length < 1 && (
            <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
              More
            </button>
          )}
          <button onClick={handleOpenComments}>Leave a comment</button>
          {comments.length > 0 && !CommsVis && (
            <button onClick={handleOpenComments}>View comments</button>
          )}
          {comments.length > 0 && CommsVis && (
            <button onClick={handleOpenComments}>Hide Comments</button>
          )}
        </span>
        {fullBody.length > 0 && (
          <button value={fullBody} onClick={() => handleReadMore(snap.body)}>
            Less
          </button>
        )}
        <br />
        {leaveCommentVis && (
          <div>
            <textarea
              onChange={(e) => setCommentBody(e.target.value)}
              value={commentBody}
            ></textarea>
            <button onClick={() => handleSubmitComment(snap.id, commentBody)}>
              📩
            </button>
          </div>
        )}
        {comments.length > 0 && CommsVis && (
          <div>
            <h3>Comments</h3>
            {comments.map((el) => {
              return (
                <>
                  <p key={el.comment_id}>
                    {el.comment_body}
                    <span>
                      <button
                        className="del-com-btn"
                        onClick={() => handleDeleteCommentButton(el.comment_id)}
                      >
                        🗑️
                      </button>
                    </span>
                  </p>
                </>
              );
            })}
          </div>
        )}
        <hr />
      </div>
    );
  };

  useEffect(() => {
    getPastes();
    getAllComments();
  }, [allData.length, allComments.length]);

  //GET pasteBins from API
  const getPastes = async () => {
    console.log("getPastes works");
    try {
      const response = await axios.get(url + "/pastes");
      setAllData(response.data);
    } catch (error) {
      console.error("Woops... issue with GET request: ", error);
    }
  };

  //GET Allcomments from API
  const getAllComments = async () => {
    try {
      const response = await axios.get(url + `/comments`);
      setAllComments(response.data);
    } catch (error) {
      console.error("Woops... issue with GET request: ", error);
    }
  };

  //POST pastes to API
  const postPastes = async (newBody: string, newTitle?: string) => {
    console.log("postPastes function is running!");
    try {
      if (newBody.length < 1) {
        alert("You can't post an empty snap bruh😂😂😂");
      } else {
        await axios.post(url + "/pastes", { body: newBody, title: newTitle });
      }
    } catch (error) {
      console.error("Woops... issue with POST request: ", error);
    }
  };
  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pasteBinTitle === ""
      ? postPastes(pasteBinBody)
      : postPastes(pasteBinBody, pasteBinTitle);
    setPasteBinBody("");
    setPasteBinTitle("");
    getPastes();
  };

  return (
    <>
      <h1>
        WELCOME TO SNIP SNAP{" "}
        <img src="../logo.png" alt="" className="logo-image" />
      </h1>
      <form onSubmit={handlePost} className="snap-form">
        <input
          className="input-title"
          placeholder="title"
          type="text"
          value={pasteBinTitle}
          onChange={(e) => setPasteBinTitle(e.target.value)}
        />
        <textarea
          className="input-body"
          placeholder="Type your paste..."
          value={pasteBinBody}
          onChange={(e) => setPasteBinBody(e.target.value)}
        ></textarea>
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
      {allData.length > 0 && (
        <>
          <h1>Snips & Snaps</h1>
          {allData.map((el) => (
            <SnapItem key={el.id} snap={el} allCommProps={allComments} />
          ))}
        </>
      )}
    </>
  );
}
