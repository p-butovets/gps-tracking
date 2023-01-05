import { Component } from 'react';

class SyrveCloudService extends Component {

    authorize = async () => {
        const response = await fetch("/auth");
        return response
    }
}

export default SyrveCloudService;
