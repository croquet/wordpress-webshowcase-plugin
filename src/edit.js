/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {
    __experimentalHeading as Heading,
    TextControl,
    __experimentalVStack as VStack,
    __experimentalUnitControl as UnitControl,
    ComboboxControl,
    PanelBody
} from '@wordpress/components';

import {InspectorControls} from '@wordpress/block-editor';

import {useState, useCallback} from "@wordpress/element";

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

    let [cards, setCards] = useState(JSON.parse(attributes.cardsString));
    let [minHeight, setMinHeight] = useState(attributes.minHeight);

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

    const set = useCallback((item) => {
        if (item && !item.type && item.path) {
            item.type = getType(item.path);
        }

        console.log(item);
        let newCards = updateCards(item, cards);
        setCards(newCards);
        setAttributes({cardsString: JSON.stringify(newCards)});
    }, [cards]);

    const get = useCallback((index) => {
        return cards[index];
    }, [cards]);

    const updateMinHeight = (val) => {
        setAttributes({minHeight: val});
        setMinHeight(val);
    };

    let header = <Heading key={0}>Metaverse Web Showcase</Heading>;

    let rows = [...Array(2).keys()].map(i => (
        <MediaRow key={i + 1} path={get(i).path} type={get(i).type} place={i + 1} set={set} get={get}/>
    ));

    return (
        <>
            <div className="showcase-container" { ...blockProps} style={{minHeight, border: "1px solid #757575"}}>
                <VStack alignment={"top"}>
                    {[header, ...rows]}
                </VStack>
            </div>
            <InspectorControls>
                <PanelBody title={"Settings"}>
                    <UnitControl
                        label="Minimum Height"
                        value={minHeight}
                        onChange={updateMinHeight}/>
                </PanelBody>
            </InspectorControls>
        </>
    );
}

function MediaRow({path, type, place, set, get}) {
    let onPathChange = (val) => {
        set({place, path: val});
    };
    let onTypeChange = (val) => {
        set({place, path, type: val});
    };

    // className="showcase-media-row-path"

    return (
        <div className="showcase-media-row">
            <div className={"showcase-media-row-path"}>
                <TextControl
                    label={"path"}
                    value={get(place - 1).path}
                    onChange={onPathChange}
                />
            </div>
            <div className={"showcase-media-row-type"}>
                <ComboboxControl
                    label="media type"
                    onChange={onTypeChange}
                    value={type}
                    style={{width: "80px", merginLeft: "10px"}}
                    options={[
                        {label: "image", value: "image"},
                        {label: "pdf", value: "pdf"},
                        {label: "video", value: "video"}
                    ]}
                />
            </div>
        </div>
    );
}

function getType(path) {
    if (/(jpe?g|gif|png)$/i.test(path)) {
        return "image"
    }
    if (/(pdf)$/i.test(path)) {
        return "pdf";
    }
    if (/(mov|mp4)$/i.test(path)) {
        return "video";
    }
    // we should be able to get the content type if it is in the media library
    return null;
}
