var me = {
	name: 'Mario Henmanuel VU',
	email : 'mvargas0294@hotmaqil.com',
	id : '100001079045514',
	birthday : '1994-06-02'
};

var request = {

	url : 'localhost:8080/LoopRest/',
	actionType : null,
	input : null,
	output : null,

	action : function (callback) {

		this.input = $('#req').val();
		this.actionType = $('#action').val();

		if (typeof(Storage) !== "undefined") {

			var token = localStorage['token'];

			if (typeof(token)  !== "undefined"){

				self = this;

				$.ajax({
					url: this.url,
					type: this.actionType,
					dataType: 'jsonp',
					async: true,
					processData: true,
					data: {tk: token, request: this.input},
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "origin, content-type, accept"
					},
					success: function (data) {

						if (data === "expTk") {
							localStorage.clear();
							self.auth(self.input);
						} else if (data === "warning") {
							callback('Se detecto in intento de acceso incorrepto');
						}
						callback(data);
					},
					error: function (xhr, thrownError) {
						callback('Error request');
					}
				})
			}else{
				this.auth(this.input);
			}
		}else{
			alert('Su browser no soporta el almacenamiento local, necesario para el correcto funcionamiento del sistema');
		}
	},

	auth : function (req){

		self = this;
		$.ajax({
			url: self.url,
			type: "POST",
			async: false,
			dataType: 'jsonp',
			data: {fbId: me.id, name: me.name, email: me.email, birthday : me.birthday},
			success: function(data) {
				localStorage['token'] = data;
				this.action(req);
			},
			error: function (errorMsg) {
				return errorMsg;
			}
		});
	}
};

$(document).ready(function(){
	$('#request').click(function () {
		request.action(function (response) {
			alert(response);
		});
	});
});