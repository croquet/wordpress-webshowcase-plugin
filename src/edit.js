/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import { TextControl,
        __experimentalVStack as VStack,
        } from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
    const blockProps = useBlockProps();
    console.log("attributes", attributes);
    if (!attributes.cardsString) {
        let cardsString = JSON.stringify([
            {place: 1, type: "image", path: "https://croquet.io/webshowcase/siteCompanyLogo.jpg"},
            {place: 2, type: "pdf", path: "https://croquet.io/webshowcase/site/CompanyDeck.pdf"},
        ]);
        setAttributes({cardsString});
    };

    const updateCards = (item, cardsArray) => {
        const index = cardsArray.findIndex((a) => a.place === item.place);
        const newCards = [...cardsArray];
        if (index >= 0) {
            newCards[index] = item;
        } else {
            newCards.push(item);
        }
        return newCards;
    };

    const set = (item) => {
        let cardsArray = JSON.parse(attributes.cardsString);
        let newCards = updateCards(item, cardsArray);
        setAttributes({cardsString: JSON.stringify(newCards)});
    }

    const get = (index) => {
        let cardsArray = JSON.parse(attributes.cardsString);
        return cardsArray[index];
    };

    return (
        <div { ...blockProps }>
            <VStack>
                <TextControl
                    value={get(0).path}
                    onChange={ ( val ) => set( { place: 1, path: val } )}
                />
                <TextControl
                    value={get(1).path}
                    onChange={ ( val ) => set( { place: 2, path: val } ) }
                />
            </VStack>
        </div>
    );
}
