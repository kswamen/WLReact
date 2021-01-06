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
                <Button key={this.props.isopen} style={{ alignSelf: "flex-end", justifySelf: 'flex-end' }}
                    onClick={this.props.handleClick} >
                    {'➥ ' + this.props.childCount + ' 개의 댓글 '} {this.props.isopen == false ? '열기' : '닫기'}
                </Button>
            </>
        );
    }
}

export default NestedComments;
