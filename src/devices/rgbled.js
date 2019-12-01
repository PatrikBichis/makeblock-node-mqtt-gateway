export static class rgbled{
    static update(board, port, color){
        board.rgbledDisplay(port,2,0,color.r,color.g,color.b);
    }
}