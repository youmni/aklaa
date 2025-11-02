import React from 'react';
import { Box } from '@chakra-ui/react';

const MarkdownRenderer = ({ content }) => {
  console.log('Content:', content);

  return (
    <Box 
      p={6} 
      bg="gray.50" 
      borderRadius="lg"
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: content }}
      css={{
        '& p': {
          marginBottom: '1rem',
          lineHeight: '1.8',
          color: '#4A5568'
        },
        '& ol': {
          paddingLeft: '2rem',
          marginBottom: '1rem',
          listStyleType: 'decimal',
          listStylePosition: 'outside'
        },
        '& ul': {
          paddingLeft: '2rem',
          marginBottom: '1rem',
          listStyleType: 'disc',
          listStylePosition: 'outside'
        },
        '& li': {
          marginBottom: '0.5rem',
          display: 'list-item'
        },
        '& h1, & h2, & h3': {
          color: '#083951',
          fontWeight: 'bold',
          marginTop: '1rem',
          marginBottom: '0.75rem'
        }
      }}
    />
  );
};

export default MarkdownRenderer;