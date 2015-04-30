

game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        this.gameover = false;
    },
    
//    making the game tell you when you lose or win
    
    update: function() {
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
            alert("YOU WIN!");;
        } else if (game.data.win === false && !this.gameover) {
            this.gameover(false);
            alert("YOU LOSE!");
        }
        return true;
    },
    
//    game over setting
    
    gameover: function(win) {
        if (win) {
            game.data.exp += 10;
        } else {
            game.data.exp += 1;
        }

        this.gameOver = true;
        me.save.exp = game.data.exp;
        
//        gettinng php login or register to work
        
        $.ajax({
                      type: "POST",
                      url: "php/controller/save-user.php",
                      data: {
                          exp: game.data.exp,
                          exp1: game.data.exp1,
                          exp2: game.data.exp2,
                          exp3: game.data.exp3,
                          exp4: game.data.exp4,
                      },
                      dataType: "text"
                   })
                           .success(function(response){
                               if(response==="true"){
                                   me.state.change(me.state.MENU);
                               }else{
                                   alert(response);
                               }
                           })
                           .fail(function(response){
                              alert("Fail"); 
                           });
                        
                        }
});

