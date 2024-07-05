import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import uniffi.mopro.GenerateProofResult
import uniffi.mopro.generateCircomProof
import uniffi.mopro.verifyCircomProof

@Composable
fun EUVerifierComponent(zkeyPath: String) {
  var provingTime by remember { mutableStateOf("Proving Time:") }
  var verifyingTime by remember { mutableStateOf("Verifying Time: ") }
  var valid by remember { mutableStateOf("Valid:") }
  var res by remember {
    mutableStateOf<GenerateProofResult>(
      GenerateProofResult(proof = ByteArray(size = 0), inputs = ByteArray(size = 0))
    )
  }

  // The following inputs were generated via the `run.ts` script in the `euclid-circuit` repository
  //  See: https://github.com/0xSileo/Euclid-circuit/blob/main/circuits/manual-test/run.ts
  val inputs = mutableMapOf<String, List<String>>()
  inputs["SODSignedDataPadded"] = listOf(
    "72", "101", "108", "108", "111", "32", "87", "111", "114", "108", "100", "128", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "88",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"
  )
  inputs["SODSignedDataPaddedLength"] = listOf("64")
  inputs["SODSignature"] = listOf(
    "1739082220851303121476828764542280132",
    "976592930788304373466285260333088241",
    "1072636862072167298025970961528156514",
    "1711788214298235856174168823961802806",
    "2314268518637767262332114114116720105",
    "1162968457755777928345239335558618426",
    "2137211077860966996974479007171788081",
    "1449849681306655147237384500381756153",
    "2267437182689523955320922722086859207",
    "1486401555495115732802220304903785519",
    "1313597984984502952501103729478031492",
    "575100790821431121356493295528064716",
    "1730876676452424222003371347281133998",
    "760262808907783721596237933155240371",
    "308972001097778953612576652045089448",
    "1084360760116788496251750929803065348",
    "642572252999485227351158919496137"
  )
  inputs["dsPublicKey"] = listOf(
    "503426545528721799067421024216519717",
    "219624507943967399463899670398801325",
    "1683550153471811308650638190407884799",
    "1442025809870744487060113383915437956",
    "625290467663246439327179669364018644",
    "1119209528184846553238470023676859608",
    "407447063546339350595765012671218744",
    "1084238885031036664605283082604123812",
    "1206082076381544492415799143750401688",
    "22185709700355257521004561064598150",
    "1073800247075190011574858683859424692",
    "1928315974183658792857119868732765398",
    "334448383931314336078782870986651533",
    "1663630450538579376304776531504312369",
    "2278465016950283292977313932294856497",
    "483007370679560493399878044422247705",
    "3901927583393493705484088885745445"
  )

  Box(modifier = Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
    Button(
      onClick = {
        Thread(
          Runnable {
            val startTime = System.currentTimeMillis()
            res = generateCircomProof(zkeyPath, inputs)
            val endTime = System.currentTimeMillis()
            provingTime =
              "Proving Time: " +
                (endTime - startTime).toString() +
                " ms"
          }
        )
          .start()
      },
      modifier = Modifier.padding(top = 20.dp)
    ) { Text(text = "Generate Proof") }
    Button(
      onClick = {
        val startTime = System.currentTimeMillis()
        valid = "Valid: " + verifyCircomProof(zkeyPath, res.proof, res.inputs).toString()
        val endTime = System.currentTimeMillis()
        verifyingTime = "Verifying Time: " + (endTime - startTime).toString() + " ms"
      },
      modifier = Modifier.padding(top = 120.dp)
    ) { Text(text = "Verify Proof") }
    Text(
      text = "EU ID Proof",
      modifier = Modifier.padding(bottom = 180.dp),
      fontWeight = FontWeight.Bold
    )

    Text(text = provingTime, modifier = Modifier.padding(top = 250.dp).width(200.dp))
    Text(text = valid, modifier = Modifier.padding(top = 350.dp).width(200.dp))
    Text(text = verifyingTime, modifier = Modifier.padding(top = 300.dp).width(200.dp))
  }
}
