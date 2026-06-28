"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    ListItemNode,
} from "@lexical/list";
import { HeadingNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
    FORMAT_TEXT_COMMAND,
    EditorState,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getRoot
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { useEffect, useState } from "react";
import { $generateNodesFromDOM } from "@lexical/html";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Pilcrow,
} from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const initialConfig = {
    namespace: "JobEditor",
    theme: {
        heading: {
            h1: "text-4xl font-bold my-3",
            h2: "text-3xl font-bold my-3",
            h3: "text-2xl font-bold my-2",
            h4: "text-xl font-bold my-2",
            h5: "text-lg font-bold my-1",
            h6: "text-base font-bold my-1",
        },
        list: {
            ul: "list-disc pl-6 my-2",
            ol: "list-decimal pl-6 my-2",
            listitem: "my-1",
        },
        text: {
            bold: "font-bold",
            italic: "italic",
        },
        paragraph: "my-1",
    },
    onError(error: Error) {
        throw error;
    },
    nodes: [ListNode, ListItemNode, HeadingNode],
};

type ToolbarButtonProps = {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
};

function ToolbarButton({ onClick, label, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
        >
            {children}
        </button>
    );
}

function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const formatHeading = (level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(level));
            }
        });
    };

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    return (
        <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-3 dark:border-gray-700">
            {/* Paragraph */}
            <ToolbarButton onClick={formatParagraph} label="Paragraph">
                {/* <Pilcrow size={16} /> */}
                <span className="text-sm font-medium">P</span>
            </ToolbarButton>

            {/* Headings */}
            <ToolbarButton onClick={() => formatHeading("h1")} label="Heading 1">
                <Heading1 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatHeading("h2")} label="Heading 2">
                <Heading2 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatHeading("h3")} label="Heading 3">
                <Heading3 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatHeading("h4")} label="Heading 4">
                <Heading4 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatHeading("h5")} label="Heading 5">
                <Heading5 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatHeading("h6")} label="Heading 6">
                <Heading6 size={16} />
            </ToolbarButton>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Bold */}
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                label="Bold"
            >
                <Bold size={16} />
            </ToolbarButton>

            {/* Italic */}
            <ToolbarButton
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                label="Italic"
            >
                <Italic size={16} />
            </ToolbarButton>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Bullet List */}
            <ToolbarButton
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                label="Bullet List"
            >
                <List size={16} />
            </ToolbarButton>

            {/* Numbered List */}
            <ToolbarButton
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                label="Numbered List"
            >
                <ListOrdered size={16} />
            </ToolbarButton>
        </div>
    );
}

function EditorChangePlugin({ onChange }: { onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();

    return (
        <OnChangePlugin
            onChange={(editorState: EditorState) => {
                editorState.read(() => {
                    const html = $generateHtmlFromNodes(editor);
                    onChange(html);
                });
            }}
        />
    );
}

function LoadHtmlPlugin({ value }: { value: string }) {
    const [editor] = useLexicalComposerContext();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!editor || !value || isLoaded) return;

        editor.update(() => {
            const parser = new DOMParser();

            const dom = parser.parseFromString(
                value,
                "text/html"
            );

            const nodes = $generateNodesFromDOM(
                editor,
                dom
            );

            const root = $getRoot();

            root.clear();
            root.append(...nodes);
        });

        setIsLoaded(true);
    }, [editor, value, isLoaded]);

    return null;
}

export default function JobEditor({ value, onChange }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <LexicalComposer initialConfig={initialConfig}>
                <Toolbar />

                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="min-h-[200px] outline-none text-gray-800 dark:text-white/90"
                                aria-placeholder="Enter job description..."
                                placeholder={
                                    <div className="pointer-events-none absolute top-0 left-0 text-gray-400">
                                        Enter job description...
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>

                <HistoryPlugin />
                <ListPlugin />
                <LoadHtmlPlugin value={value} />
                <EditorChangePlugin onChange={onChange} />
            </LexicalComposer>
        </div>
    );
}