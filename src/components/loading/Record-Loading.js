import React from 'react';
import {Flex, LoadingText} from './LoadingStyle';
import Spinner from './Spinner.gif';

export default () => {
    return (
        <Flex >
            <img src={Spinner} alt="로딩중" width="10%" />
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
        </Flex>
    );
};
