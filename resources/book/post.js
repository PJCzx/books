if(!me) {
    cancel("You must be both connected", 401);
}
this.creator = me.id;
this.creationDate = Date.now();