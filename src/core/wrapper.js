import React, { Component } from 'react';

import UploadMainArchive from './dsp/components/upload-archive/upload-archive';
export class CustomWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <div>
                <UploadMainArchive />
            </div>
        );
    }
}
export default CustomWrapper;