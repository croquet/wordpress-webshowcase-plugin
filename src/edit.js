/**
 * The Croquet Web Showcase editor. It creates a list of "places" where you can put URLs.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */

import {__} from '@wordpress/i18n';

import {
    __experimentalHeading as Heading,
    Button,
    TextControl,
    __experimentalVStack as VStack,
    __experimentalUnitControl as UnitControl,
    __experimentalDivider as Divider,
    ComboboxControl,
    __experimentalText as Text,
    PanelBody,
    DropZone
} from '@wordpress/components';

import {
    InspectorControls
} from '@wordpress/block-editor';

import {useState, useCallback} from "@wordpress/element";

import { uploadMedia } from "@wordpress/media-utils";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps} from '@wordpress/block-editor';

/**
 * The Croquet Web Showcase editor. It creates a list of "places" where you can put URLs.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    let blockProps = useBlockProps();

    let [cards, setCards] = useState(JSON.parse(attributes.cardsString));
    let [minHeight, setMinHeight] = useState(attributes.minHeight);
    let [apiKey, setApiKey] = useState(attributes.apiKey);
    let [showcaseName, setShowcaseName] = useState(attributes.showcaseName);

    let updateCards = (item, index, cardsArray) => {
        let newCards = [...cardsArray];
        newCards[index] = item;
        return newCards;
    };

    let renumberCards = useCallback((newCards) => {
        for (let i = 0; i < newCards.length; i++) {
            newCards[i].place = i + 1;
        }
        return newCards;
    }, []);

    let updateCardAttributeWith = useCallback((updater) => {
        setCards((oldCards) => {
            let newCards = updater(oldCards);
            renumberCards(newCards);
            setAttributes({cardsString: JSON.stringify(newCards)});
            return newCards;
        });
    }, [renumberCards]);

    let set = useCallback((item, index) => {
        updateCardAttributeWith((oldCards) => {
            if (item && !item.type && item.path) {
                item.type = getType(item.path);
            }
            return updateCards(item, index, oldCards);
        });
    }, [updateCardAttributeWith, updateCards]);

    let get = useCallback((index) => {
        return cards[index];
    }, [cards]);

    let move = useCallback((dir, index) => {
        updateCardAttributeWith((oldCards) => {
            let newCards = [...oldCards];
            if (dir === "up") {
                let t = newCards[index - 1];
                newCards[index - 1] = newCards[index];
                newCards[index] = t;
                return newCards;
            }
            if (dir === "down") {
                let t = newCards[index + 1];
                newCards[index + 1] = newCards[index];
                newCards[index] = t;
                return newCards;
            }
        })
    }, [updateCardAttributeWith]);

    let add = useCallback((optObj) => {
        updateCardAttributeWith((oldCards) => {
            if (cards.length === 9) {return oldCards;}
            let newCards = [...oldCards];
            newCards.push(optObj || {});
            return newCards;
        });
    }, [updateCardAttributeWith]);

    let remove = useCallback((index) => {
        updateCardAttributeWith((oldCards) => {
            let newCards = [...oldCards];
            newCards.splice(index, 1);
            return newCards;
        });
    }, [updateCardAttributeWith]);

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

    let handleFileChange = (files) => {
        let hasAll = files.map((file) => file.id).reduce((total, current) => total && current, true);
        if (!hasAll) {return;}
        files.forEach((file) => {
            if (file.id) {
                let type = getType(file.url);
                if (!type) {
                    let mime_type = file.mime_type;
                    /*
                    if (mime_type.startsWith("image")) {
                        type = "image";
                        } else */
                    if (mime_type.startsWith("application/pdf")) {
                        type = "pdf";
                    } else if (mime_type.startsWith("video")) {
                        type = "video";
                    }
                }
                if (type) {
                    add({path: file.url, type});
                }
            }
        });
    };

    let handleFileError = (f) => {
        console.error(f);
    };

    let onFilesDrop = (files) => {
        uploadMedia({
            filesList: files,
            onFileChange: handleFileChange,
            onError: handleFileError
        });
    };

    let title = <Heading style={{alignSelf: "center"}} key={-5} level={4}>{__("Croquet Web Showcase", "croquet-showcase")}</Heading>;

    let apiKeyMessage;
    if (apiKey === "") {
        apiKeyMessage = __("Please set API key in the side bar settings", "croquet-showcase");
    } else {
        apiKeyMessage =  __("apiKey: ", "croquet-showcase") + apiKey;
    }
    let apiKeyMessageColor = apiKey === "" ? "red" : "black";
    let apiKeyText = (
        <Text style={{marginRight: "10px"}} color={apiKeyMessageColor} key={-1} align="right">
            {apiKeyMessage}
        </Text>
    );

    let showcaseMessage;
    let showcaseMessageColor = "red";
    if (showcaseName === "") {
        showcaseMessage = __("Please set Showcase Name in the side bar settings", "croquet-showcase");
    } else {
        if (/^[A-Za-z0-9-]+$/.test(showcaseName)) {
            showcaseMessage = __("showcase name: ", "croquet-showcase") + showcaseName;
            showcaseMessageColor = "black";
        } else {
            showcaseMessage = __("Please use only alpha numeric characters and hyphens.", "croquet-showcase");
        }
    }

    let showcaseNameText = (
        <Text style={{marginRight: "10px"}} color={showcaseMessageColor} key={-2} align="right">
            {showcaseMessage}
        </Text>
    );

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

    let addButton = (<AddButton key={-6} visible={cards.length < 9} add={() => add()}/>);

    return (
        <>
            <div className="showcase-container" { ...blockProps} style={{minHeight, border: "1px solid #757575"}}>
                <VStack alignment={"top"}>
                    {[title, apiKeyText, showcaseNameText, <Divider key={-4}/>, ...rows, addButton]}
                </VStack>
                <DropZone onFilesDrop={onFilesDrop}/>
            </div>
            <InspectorControls>
                <PanelBody title={"Settings"}>
                    <TextControl
                        label={__("Croquet API Key", "croquet-showcase")}
                        value={apiKey}
                        onChange={updateApiKey}/>
                    <TextControl
                        label={__("Showcase Name", "croquet-showcase")}
                        value={showcaseName}
                        onChange={updateShowcaseName}/>
                    <UnitControl
                        label={__("Minimum Height", "croquet-showcase")}
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
                    label={__("path")}
                    value={path}
                    onChange={onPathChange}
                />
            </div>
            <div className={"showcase-media-row-type"}>
                <ComboboxControl
                    label={__("media type")}
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
    let buttonStyle = {width: "24px", height: "24px"};
    let style = {};
    if (!visible) {
        style.display = "none"
    }

    let textStyle = {fontSize: "90%", marginLeft: "auto", marginRight: "auto", paddingLeft: "36px"};

    let dropMessage = (
        <Text style={textStyle}>
            {__("Drop a media file (PNG, JPEG, MP4, or PDF)", "croquet-showcase")}
        </Text>
    );

    return (
        <div className="showcase-add-row" style={style}>
            {dropMessage}
            <Button variant="primary" style={buttonStyle}
                onClick={add}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"></path></svg>}/>
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
