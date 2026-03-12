import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Type, Highlighter, Undo, Redo, Minus,
} from "lucide-react";

// ─── Plain-text → HTML conversion ────────────────────────────────────────────

function plainToHtml(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) { i++; continue; }

    // ALL-CAPS heading (and not a bullet / short label)
    if (
      line === line.toUpperCase() &&
      line.length > 3 &&
      !/[•·\-–]/.test(line[0]) &&
      !line.startsWith("+")
    ) {
      out.push(`<h2>${line}</h2>`);
      i++;
      continue;
    }

    // Bullet points starting with • · - +
    if (/^[•·\-+]/.test(line)) {
      const items: string[] = [];
      while (
        i < lines.length &&
        /^[•·\-+]/.test(lines[i].trim()) &&
        lines[i].trim().length > 1
      ) {
        items.push(`<li><p>${lines[i].trim().replace(/^[•·\-+]\s*/, "")}</p></li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    out.push(`<p>${line}</p>`);
    i++;
  }

  return out.join("");
}

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

const Divider = () => (
  <div className="w-px h-5 bg-border mx-1 shrink-0" />
);

const TBtn = ({
  onClick,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors shrink-0 ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`}
  >
    {children}
  </button>
);

// ─── RichTextEditor ───────────────────────────────────────────────────────────

interface Props {
  content: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
}

const RichTextEditor = ({ content, onChange, readOnly = false }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Typography,
    ],
    content: plainToHtml(content),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content focus:outline-none",
      },
    },
  });

  // Sync content when version is switched from outside
  useEffect(() => {
    if (!editor) return;
    const newHtml = plainToHtml(content);
    if (editor.getHTML() !== newHtml) {
      editor.commands.setContent(newHtml, false);
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  const iconSize = "h-3.5 w-3.5";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Toolbar ── */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-card shrink-0 flex-wrap">
          {/* History */}
          <TBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo className={iconSize} />
          </TBtn>
          <TBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo className={iconSize} />
          </TBtn>

          <Divider />

          {/* Block type */}
          <TBtn
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            title="Paragraph"
          >
            <Type className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className={iconSize} />
          </TBtn>

          <Divider />

          {/* Inline formatting */}
          <TBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter className={iconSize} />
          </TBtn>

          <Divider />

          {/* Lists */}
          <TBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <ListOrdered className={iconSize} />
          </TBtn>

          <Divider />

          {/* Alignment */}
          <TBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align left"
          >
            <AlignLeft className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align center"
          >
            <AlignCenter className={iconSize} />
          </TBtn>
          <TBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align right"
          >
            <AlignRight className={iconSize} />
          </TBtn>

          <Divider />

          {/* Rule */}
          <TBtn
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >
            <Minus className={iconSize} />
          </TBtn>
        </div>
      )}

      {/* ── Editor content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-[hsl(196_89%_7%)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
