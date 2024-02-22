import { useState } from "react";
import { Text } from "react-native";
import { 
    Popover,
    PopoverBackdrop,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    PopoverFooter,
    Heading, Icon, CloseIcon, Button
} from '@gluestack-ui/themed';

import { FontAwesome } from '@expo/vector-icons';

/**
 * Info - Display's text info.
 * @param {props} props - The properties passed to the component.
 * @param {title} props.title - The title of the popover.
 * @param {info} props.info - The text to be displayed.
 * @param {footer} props.footer - Bottom component
 * @returns {JSX.Element} A React element.
 */
export const Info = ( {props} ) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };
    
    const handleClose = () => {
        setIsOpen(false);
    };

    return (          
        <Popover
        isOpen={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        placement="bottom left" size="md"
        trigger={(triggerProps) => {
            return (
            <Button
                {...triggerProps}
                style={{alignSelf: 'flex-end', 
                        margin: 30, backgroundColor: 'rgba(0,0,0,.45)'}}
            >
                <FontAwesome name="bars" size={20} color="rgba(255,255,255,1)"/>
            </Button>
            );
        }}
        >
        <PopoverBackdrop/>
        <PopoverContent>
        <PopoverArrow />
            <PopoverHeader>
            <Heading size='lg'> {props.title} </Heading>
            <PopoverCloseButton>
                <Icon as={CloseIcon}/>
            </PopoverCloseButton>
            </PopoverHeader>
            <PopoverBody>
            <Text size='sm' style={{alignSelf: 'center', fontWeight: '400', fontSize: 16, lineHeight: 22}}>
                {props.info}
            </Text>
            </PopoverBody>
            <PopoverFooter>
                {props.footer}
            </PopoverFooter>
        </PopoverContent>
        </Popover>
    );
};