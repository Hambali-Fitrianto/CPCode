$(document).ready(function () {
    loadCodes();

    $("#saveCode").click(function () {
        let name = $("#codeName").val().trim();
        let content = $("#codeContent").val().trim();

        if (name === "" || content === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Nama dan kode tidak boleh kosong!',
            });
            return;
        }

        let codes = JSON.parse(localStorage.getItem("codes")) || {};
        codes[name] = content;
        localStorage.setItem("codes", JSON.stringify(codes));

        $("#codeName").val("");
        $("#codeContent").val("");
        loadCodes();
    });

    function loadCodes() {
        let codes = JSON.parse(localStorage.getItem("codes")) || {};
        $("#codeList").empty();
        $("#codeDisplay").empty();

        $.each(codes, function (name, content) {
            let listItem = `<li class="list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeInLeft">
                ${name}
                <button class="btn btn-sm btn-primary show-code" data-name="${name}">👀 Lihat</button>
            </li>`;
            $("#codeList").append(listItem);
        });

        $(".show-code").click(function () {
            let name = $(this).data("name");
            showCode(name);
        });
    }

    function showCode(name) {
        let codes = JSON.parse(localStorage.getItem("codes")) || {};
        let content = codes[name];

        let codeBlock = `<div class="card mt-3 animate__animated animate__fadeInUp">
            <div class="code-header">
                <span>${name}</span>
                <div class="code-buttons">
                    <button class="btn-copy" onclick="copyCode('${name}')">📋 Copy</button>
                    <button class="btn-delete" onclick="deleteCode('${name}')">🗑️ Hapus</button>
                </div>
            </div>
            <div class="card-body">
                <div class="code-container">
                    <pre><code id="code-${name}">${escapeHtml(content)}</code></pre>
                </div>
            </div>
        </div>`;

        $("#codeDisplay").html(codeBlock);
    }

    window.deleteCode = function (name) {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Kode ini akan dihapus selamanya!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                let codes = JSON.parse(localStorage.getItem("codes")) || {};
                delete codes[name];
                localStorage.setItem("codes", JSON.stringify(codes));
                loadCodes();
                $("#codeDisplay").empty();
                Swal.fire("Terhapus!", "Kode berhasil dihapus!", "success");
            }
        });
    };

    window.copyCode = function (name) {
        let text = document.getElementById(`code-${name}`).innerText;
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Kode berhasil disalin!',
                showConfirmButton: false,
                timer: 1500
            });
        });
    };

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
    }
});
