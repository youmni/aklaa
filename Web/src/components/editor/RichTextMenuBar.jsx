import { Flex, IconButton, Button } from '@chakra-ui/react';
import { FaBold, FaItalic, FaStrikethrough, FaListOl, FaListUl } from 'react-icons/fa';

const RichTextMenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <Flex gap={2} p={2} borderBottom="1px solid" borderColor="gray.200" flexWrap="wrap" bg="white">
            <IconButton
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                variant={editor.isActive('bold') ? 'solid' : 'ghost'}
                aria-label="Bold"
            >
                <FaBold />
            </IconButton>
            <IconButton
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                variant={editor.isActive('italic') ? 'solid' : 'ghost'}
                aria-label="Italic"
            >
                <FaItalic />
            </IconButton>
            <IconButton
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                colorScheme={editor.isActive('strike') ? 'blue' : 'gray'}
                variant={editor.isActive('strike') ? 'solid' : 'ghost'}
                aria-label="Strikethrough"
            >
                <FaStrikethrough />
            </IconButton>
            <IconButton
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                colorScheme={editor.isActive('bulletList') ? 'blue' : 'gray'}
                variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
                aria-label="Bullet List"
            >
                <FaListUl />
            </IconButton>
            <IconButton
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                colorScheme={editor.isActive('orderedList') ? 'blue' : 'gray'}
                variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
                aria-label="Ordered List"
            >
                <FaListOl />
            </IconButton>
            <Button
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                colorScheme={editor.isActive('heading', { level: 1 }) ? 'blue' : 'gray'}
                variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
            >
                H1
            </Button>
            <Button
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                colorScheme={editor.isActive('heading', { level: 2 }) ? 'blue' : 'gray'}
                variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
            >
                H2
            </Button>
            <Button
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                colorScheme={editor.isActive('heading', { level: 3 }) ? 'blue' : 'gray'}
                variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'}
            >
                H3
            </Button>
        </Flex>
    );
};

export default RichTextMenuBar;