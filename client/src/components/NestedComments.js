import React from "react";
import Slider from "react-slick";
import { post } from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "../css/carousel.css";

class NestedComments extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <>
                {this.props.isopen == false ? <> </> :
                    <Button style={{ alignSelf: "flex-end", justifySelf: 'flex-end' }}>
                        {this.props.parentComment}
                    </Button>}
            </>
        );
    }
}

export default NestedComments;
