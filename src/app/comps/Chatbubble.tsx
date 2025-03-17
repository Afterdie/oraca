export interface ChatbubbleTypes {
  content: string;
  sender: boolean;
}
const Chatbubble = ({ content, sender }: ChatbubbleTypes) => {
  return (
    <div
      className={`flex w-full items-start ${sender ? "justify-end" : "justify-start"}`}
    >
      {!sender && (
        <div className="border-accent-foreground mt-[15px] h-4 w-4 rounded-full border bg-gradient-to-tr from-blue-600 to-orange-300"></div>
      )}
      <div
        className={`${sender ? "bg-secondary max-w-[60%]" : "max-w-[90%]"} h-full rounded-lg p-2 px-4`}
      >
        {content}
      </div>
    </div>
  );
};

export default Chatbubble;
