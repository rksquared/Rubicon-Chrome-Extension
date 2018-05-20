import {Page} from './Page';
import {HistoryNode} from './HistoryNode';

class SuggestionNode {
    page: Page;
    anchor: HistoryNode;
    isSuggestion: boolean = true;
    id: number;
}

export {
    SuggestionNode
}
