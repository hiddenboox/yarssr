/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react'

import { Fixed } from './Position';

const style = css`
    color: red;
`

export const App = ({ router: Router }) => {
    return (
        <Router>
            <span css={style}>Test</span>
            <Fixed top={20} left={20}>Left</Fixed>
            <Fixed top={20} right={20}>Right</Fixed>
        </Router>
    );
}