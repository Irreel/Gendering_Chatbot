import React, { useState } from "react";
import { Link, Form } from "react-router-dom";

function Post() {
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    
    return (
        <div>
            <h3>Post-test Survey</h3>
            {/* <h5>Please fill out this post test survey </h5>  */}
            
            <Form className="survey">

                <input
                placeholder="Email"
                type="text"
                onChange={(event) => setEmail(event.target.value)}
                />
                <br/>

                <input
                placeholder="Name"
                type="text"
                onChange={(event) => setName(event.target.value)}
                />
                <br/>

                <Link to={`/end`}>
                    <button type="submit">Submit</button>
                </Link>

            </Form>

        </div>
    );
}

export default Post;