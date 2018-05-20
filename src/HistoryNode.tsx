import {Page} from './Page';
import {SuggestionNode} from './SuggestionNode';

class HistoryNode {
    page: Page;
    prev: HistoryNode | null;
    next: HistoryNode | null;
    suggestions: SuggestionNode[];
    isSuggestion: boolean = false;
    id: number;
}

export {
    HistoryNode
}
