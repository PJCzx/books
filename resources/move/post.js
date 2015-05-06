if(!me) {
    cancel("You must be connected", 401);
}
this.creator = me.id;
this.creationDate = Date.now();