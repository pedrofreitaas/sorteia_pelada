import { useState } from "react";
import { Text, View, FlatList, Pressable, StyleSheet } from "react-native";

/**
 * OptionsContainer - Maintains a single user choice, based in a list of options.
 * @param {props} props - The properties passed to the component.
 * @param {options} props.options - The list of options.
 * @param {selected} props.selected - The current selected option.
 * @returns {JSX.Element} A React element.
 */
export function OptionsContainer ( {props} ) {
    const [_options, set_Options] = useState( props.options.map((opt) => {
        if(props.selected === opt) return [true, opt];
        return [false, opt]
    }) );

    const updateChosenOption = ( option ) => {
        const new_Options = _options.map( (opt) => {
            if(opt[1] === option) {
                props.setValue(option);
                return [true, opt[1]]
            }

            else
                return[false, opt[1]]; 
        });
    
        set_Options(new_Options);
    };

    return (
        <View
        style={styles.container}>
            <FlatList
            style={styles.options}
            data={_options}
            horizontal= {true}
            renderItem={ (option) =>  
                <Pressable
                onPress={ () => updateChosenOption(option.item[1]) }>
                    <Text 
                    style={option.item[0] ? styles.chosen_option : styles.option}>
                        {option.item[1]}
                    </Text>
                </Pressable>
            }
            />
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(110, 110, 110, .6)',
        height: 50,

        borderRadius: 10,

        margin: 5, marginBottom: 10,
    },

    options: {
        flexDirection: 'row',
        padding: 5,
    },

    option: {
        marginLeft: 5, marginRight: 5,
        fontSize: 20, fontWeight: 'bold',

        padding: 6,
    },

    chosen_option: {
        padding: 6,

        backgroundColor: 'rgba(0, 210, 0, .7)',
        fontSize: 20, fontWeight: 'bold',

        borderRadius: 40,
    },
});