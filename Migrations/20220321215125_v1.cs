using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Projekat.Migrations
{
    public partial class v1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dokument",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tip = table.Column<int>(type: "int", nullable: false),
                    DatumIzdavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Drzavljanstvo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dokument", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Drzava",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drzava", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Poternica",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Stroga = table.Column<bool>(type: "bit", maxLength: 50, nullable: false),
                    JMBG = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poternica", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "DokumentDrzava",
                columns: table => new
                {
                    PodrzaneDrzaveID = table.Column<int>(type: "int", nullable: false),
                    PodrzaniDokumentiID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DokumentDrzava", x => new { x.PodrzaneDrzaveID, x.PodrzaniDokumentiID });
                    table.ForeignKey(
                        name: "FK_DokumentDrzava_Dokument_PodrzaniDokumentiID",
                        column: x => x.PodrzaniDokumentiID,
                        principalTable: "Dokument",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DokumentDrzava_Drzava_PodrzaneDrzaveID",
                        column: x => x.PodrzaneDrzaveID,
                        principalTable: "Drzava",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DrzavaPoternica",
                columns: table => new
                {
                    TrazeniLjudiID = table.Column<int>(type: "int", nullable: false),
                    ZabranjenUlazUDrzaveID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrzavaPoternica", x => new { x.TrazeniLjudiID, x.ZabranjenUlazUDrzaveID });
                    table.ForeignKey(
                        name: "FK_DrzavaPoternica_Drzava_ZabranjenUlazUDrzaveID",
                        column: x => x.ZabranjenUlazUDrzaveID,
                        principalTable: "Drzava",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DrzavaPoternica_Poternica_TrazeniLjudiID",
                        column: x => x.TrazeniLjudiID,
                        principalTable: "Poternica",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DokumentDrzava_PodrzaniDokumentiID",
                table: "DokumentDrzava",
                column: "PodrzaniDokumentiID");

            migrationBuilder.CreateIndex(
                name: "IX_DrzavaPoternica_ZabranjenUlazUDrzaveID",
                table: "DrzavaPoternica",
                column: "ZabranjenUlazUDrzaveID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DokumentDrzava");

            migrationBuilder.DropTable(
                name: "DrzavaPoternica");

            migrationBuilder.DropTable(
                name: "Dokument");

            migrationBuilder.DropTable(
                name: "Drzava");

            migrationBuilder.DropTable(
                name: "Poternica");
        }
    }
}
