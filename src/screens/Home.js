import {Box, Container, Link} from '@mui/material';
import {useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
export default function Home() {
    useEffect(() => {
        document.title = '楓之谷工具箱';
    }, []);
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', p: 7}}>
            楓之谷小工具
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Link component={RouterLink} to="/destiny-scroll-calculator">
                    恢復卡衝命運卷成本預估
                </Link>
                <Link component={RouterLink} to="/virtual-draw">
                    模擬抽獎
                </Link>
            </Box>
        </Container>
    );
}
