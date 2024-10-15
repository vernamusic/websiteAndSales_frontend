import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import { Share, Visibility, Facebook, Twitter } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Mediacard from './Mediacard.jsx'; // ایمپورت کردن کامپوننت Mediacard

const theme = createTheme({
    typography: {
        h6: {
            fontFamily: 'sen',
            fontSize: { xs: '8px', sm: '10px', md: '16px', lg: '20px', xl: '24px' },
            lineHeight: 'normal',
            letterSpacing: '0.8px',
            fontWeight: 400,
            color: '#F1F1F1',
            textTransform: 'none',
        },
        h3: {
            fontFamily: 'Lato',
            fontWeight: 700,
            fontSize: { xs: '10px', sm: '15px', md: '19px', lg: '28px', xl: '32px' },
            color: '#F1F1F1',
            textTransform: 'none',
        },
        button: {
            fontFamily: 'Inter',
            fontSize: { xs: '9px', sm: '12px', md: '18px', lg: '22px', xl: '26px' },
            textTransform: 'none',
            color: '#F1F1F1',
        },
    },
});

const NewsCard = () => {
    const { slug } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        fetch(`https://site.vitruvianshield.com/api/v1/news/${slug}`)
            .then((response) => response.json())
            .then((data) => {
                setNewsData(data);

                const now = moment();
                const publishedTime = moment(data.created_at);
                const duration = moment.duration(now.diff(publishedTime));
                const hoursAgo = Math.floor(duration.asHours());
                setTimeAgo(hoursAgo > 24 ? `${Math.floor(duration.asDays())} days ago` : `${hoursAgo} hours ago`);
            });
    }, [slug]);

    if (!newsData) return <div>Loading...</div>;

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    height: 'auto',
                    position: 'relative',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100vw',
                        height: {
                            xs: '230px',
                            sm: '300px',
                            md: '430px',
                            lg: '560px',
                            xl: '700px',
                        },
                        position: 'relative',
                        backgroundImage: `url(${newsData.picture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top right',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></Box>

                <Box
                    sx={{
                        position: 'relative',
                        width: '70%',
                        margin: '0 auto',
                        justifyItems: 'center',
                        pt: { xs: 1, sm: 1, md: 1.5, lg: 2, xl: 2 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            gap:0,
                            justifyContent:'space-between'
                        }}
                    >
                        <Typography variant="h4" sx={theme.typography.h3}>
                            {newsData.title}
                        </Typography>

                        <Box sx={{ display: 'flex', gap:0.5,}}>
                            <Visibility sx={{fontSize: { xs: '8px', sm: '10px', md: '16px', lg: '20px', xl: '24px' },ml: {sx:0.5,sm:1,md:2},color:'gray' }} />
                            <Typography sx={{ ...theme.typography.h6,mr:{sx:0.5,sm:1,md:2},color:'gray'}}>
                                {newsData.views}
                            </Typography>
                            <Typography sx={{ ...theme.typography.h6,display:{sm:'block',xs:'none'} }}>
                                Share:
                            </Typography>
                            <IconButton color="primary" aria-label="share on facebook" sx={{p:0}}>
                                <Facebook sx={{fontSize: { xs: '8px', sm: '10px', md: '16px', lg: '20px', xl: '24px' }}}/>
                            </IconButton>
                            <IconButton color="primary" aria-label="share on twitter" sx={{p:0}}>
                                <Twitter sx={{fontSize: { xs: '8px', sm: '10px', md: '16px', lg: '20px', xl: '24px' }}}/>
                            </IconButton>
                            <IconButton color="primary" aria-label="share" sx={{p:0}}>
                                <Share sx={{fontSize: { xs: '8px', sm: '10px', md: '16px', lg: '20px', xl: '24px' }}}/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography variant="body2" sx={{...theme.typography.h6, color: '#a50202'}}>
                            {newsData.read_time} min read
                        </Typography>
                    </Box>

                    {/* تقسیم متن details به بندها و نمایش هر بند در یک Typography */}
                    {newsData.details.split('\n').map((paragraph, index) => (
                        <Typography key={index} variant="body1" sx={{ marginTop: '10px', ...theme.typography.h6 }}>
                            {paragraph}
                        </Typography>
                    ))}

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <Typography sx={theme.typography.h6}>{timeAgo}</Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: 'gray' }} />
                        <Typography sx={theme.typography.h6}>
                            {moment(newsData.created_at).format('ddd MMMM D, YYYY')}
                        </Typography>
                    </Box>
                    <Box sx={{mb: { xs: 8, sm: 8, md: 10, lg: 10, xl: 10 },}}>
                        <Typography gutterBottom sx={{ ...theme.typography.h3, pl: 1, mb: { xs: 2, sm: 2, md: 3, lg: 4, xl: 4 }, textAlign: 'left',mt:{ xs: 2, sm: 2, md: 3, lg: 4, xl: 4 } }}>
                            Related News:
                        </Typography>
                        <Mediacard data={newsData.related_news} />
                    </Box>

                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default NewsCard;
