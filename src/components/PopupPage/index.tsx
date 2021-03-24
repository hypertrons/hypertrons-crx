import React from 'react';
import {
  Stack
} from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
import './index.css';

initializeIcons();

const PopupPage: React.FC<{}> = () => {

    return(
        <Stack horizontalAlign="center">
          <h1>Hypertrons</h1>
        </Stack>
    )
}

export default PopupPage;