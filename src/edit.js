/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {
    __experimentalHeading as Heading,
    Button,
    TextControl,
    __experimentalVStack as VStack,
    __experimentalUnitControl as UnitControl,
    __experimentalDivider as Divider,
    ComboboxControl,
    PanelBody
} from '@wordpress/components';

import {
    InspectorControls
} from '@wordpress/block-editor';

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
    let blockProps = useBlockProps();

    let [cards, setCards] = useState(JSON.parse(attributes.cardsString));
    let [minHeight, setMinHeight] = useState(attributes.minHeight);
    let [apiKey, setApiKey] = useState(attributes.apiKey);
    let [showcaseName, setShowcaseName] = useState(attributes.showcaseName);

    let updateCards = (item, index, cardsArray) => {
        const newCards = [...cardsArray];
        newCards[index] = item;
        return newCards;
    };

    let set = useCallback((item, index) => {
        console.log("set", item, index);
        if (item && !item.type && item.path) {
            item.type = getType(item.path);
        }

        let newCards = updateCards(item, index, cards);
        renumberCards(newCards);
        updateCardAttribute(newCards);
    }, [cards]);

    let get = useCallback((index) => {
        return cards[index];
    }, [cards]);

    let move = (dir, index) => {
        let newCards = [...cards];
        if (dir === "up") {
            let t = newCards[index - 1];
            newCards[index - 1] = newCards[index];
            newCards[index] = t;

            renumberCards(newCards);
            updateCardAttribute(newCards);
        } else if (dir === "down") {
            let t = newCards[index + 1];
            newCards[index + 1] = newCards[index];
            newCards[index] = t;

            renumberCards(newCards);
            updateCardAttribute(newCards);
        }
    };

    let add = () => {
        if (cards.length === 9) {return;}
        let newCards = [...cards];
        newCards.push({});
        renumberCards(newCards);
        updateCardAttribute(newCards);
    };

    let remove = (index) => {
        let newCards = [...cards];
        newCards.splice(index, 1);
        renumberCards(newCards);
        updateCardAttribute(newCards);
    };

    let renumberCards = (newCards) => {
        for (let i = 0; i < newCards.length; i++) {
            newCards[i].place = i + 1;
        }
        return newCards;
    };

    let updateCardAttribute = (newCards) => {
        setCards(newCards);
        setAttributes({cardsString: JSON.stringify(newCards)});
    };

    let updateApiKey = (val) => {
        setAttributes({apiKey: val});
        setApiKey(val);
    };

    let updateMinHeight = (val) => {
        setAttributes({minHeight: val});
        setMinHeight(val);
    };

    let updateShowcaseName = (val) => {
        setAttributes({showcaseName: val});
        setShowcaseName(val);
    };

    let title = <Heading style={{alignSelf: "center"}} key={-5} level={4}>Web Showcase Configuration</Heading>;

    let apiKeyText = (
        <div className={"showcase-media-row"} key={-1}>
            <BlockMover placeHolder={true}/>
            <div style={{width: "70%"}}>
                <TextControl label={"API Key"} value={apiKey} onChange={updateApiKey}/>
            </div>
        </div>);

    let showcaseNameText = (
        <div key={-2} className={"showcase-media-row"}>
            <BlockMover placeHolder={true}/>
            <div style={{width: "70%"}}>
                <TextControl label={"Showcase Name"} value={showcaseName} onChange={updateShowcaseName}/>
            </div>
        </div>);

    let rows = [...Array(cards.length).keys()].map(i => (
        <MediaRow
            key={i + 1}
            index={i}
            path={get(i).path || ""}
            hasUp={i !== 0} hasDown={i !== (cards.length - 1)}
            type={get(i).type} set={set}
            move={move}
            remove={remove}/>
    ));

    let addButton = (<AddButton key={-3} visible={cards.length < 9} add={add}/>);

    return (
        <>
            <div className="showcase-container" { ...blockProps} style={{minHeight, border: "1px solid #757575"}}>
                <VStack alignment={"top"}>
                    {[title, apiKeyText, showcaseNameText, <Divider key={-4}/>, ...rows, addButton]}
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

function MediaRow({path, type, index, hasUp, hasDown, set, move, remove}) {
    let onPathChange = (val) => {
        set({path: val}, index);
    };
    let onTypeChange = (val) => {
        set({path, type: val}, index);
    };

    // className="showcase-media-row-path"

    return (
        <div className="showcase-media-row">
            <BlockMover hasUp={hasUp} hasDown={hasDown} move={move} index={index}/>
            <div className={"showcase-media-row-path"}>
                <TextControl
                    label={"path"}
                    value={path}
                    onChange={onPathChange}
                />
            </div>
            <div className={"showcase-media-row-type"}>
                <ComboboxControl
                    label="media type"
                    allowReset={false}
                    onChange={onTypeChange}
                    value={type}
                    style={{width: "60px", merginLeft: "10px"}}
                    options={[
                        {label: "image", value: "image"},
                        {label: "pdf", value: "pdf"},
                        {label: "video", value: "video"}
                    ]}
                />
            </div>
            <div className={"showcase-media-row-delete"}>
                <DeleteButton index={index} remove={remove}/>
            </div>
        </div>
    );
}

function BlockMover({hasUp, hasDown, index, placeHolder, move}) {
    let upHandler = () => {
        move("up", index);
    }
    let downHandler = () => {
        move("down", index);
    }

    let upButton = (
        <button
            type="button"
            onClick={hasUp ? upHandler : null}
            tabIndex="-1"
            data-toolbar-item="true"
            aria-disabled={!hasUp}
            className="components-button block-editor-block-mover-button is-up-button has-icon"
            aria-label="Move up"
            style={{height: "24px"}}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" focusable="false"><path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z"></path></svg>
        </button>
    );

    let downButton = (
        <button
            type="button"
            onClick={hasDown ? downHandler : null}
            tabIndex="-1"
            aria-disabled={!hasDown}
            className="components-button block-editor-block-mover-button is-down-button has-icon"
            aria-label="Move down" style={{height: "24px"}}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>
        </button>
    );

    let style = {height: "48px", flexDirection: "column"};
    if (placeHolder) {
        style.visibility = "hidden";
    }
    return (
        <div className={"block-editor-block-mover__move-button-container"} style={style}>
            {upButton}
            {downButton}
        </div>
    );
}

function DeleteButton({index, remove}) {
    let onClick = () => {
        remove(index);
    };

    return (
        <Button
            onClick={onClick}
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg>}/>
    );
}

function AddButton({add, visible}) {
    let style = {width: "24px", height: "24px", alignSelf: "flex-end"};
    if (!visible) {
        style.display = "none"
    }

    return (
        <Button variant="primary" style={style}
            onClick={add}
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"></path></svg>}/>
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
