export interface ChatbubbleTypes {
  content: string;
  sender: boolean;
}
const Chatbubble = ({ content, sender }: ChatbubbleTypes) => {
  return (
    <div className={`flex w-full ${sender ? "justify-end" : "justify-start"}`}>
      <div className="bg-accent h-full w-[100px] p-2">{content}</div>
    </div>
  );
};

export default Chatbubble;
